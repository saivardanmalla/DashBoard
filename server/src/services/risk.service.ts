import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { Types } from 'mongoose';

interface RiskFactor {
  factor: string;
  score: number;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface RiskResult {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: RiskFactor[];
  recommendations: string[];
}

interface HealthComponent {
  name: string;
  score: number;
  description: string;
}

interface HealthResult {
  score: number;
  level: 'HEALTHY' | 'WARNING' | 'AT_RISK' | 'CRITICAL';
  components: HealthComponent[];
}

export async function calculateProjectRisk(projectId: string): Promise<RiskResult> {
  const tasks = await Task.find({ project: projectId }).lean();
  const total = tasks.length;
  if (total === 0) {
    return { score: 0, level: 'LOW', factors: [], recommendations: ['Add tasks to your project to track progress.'] };
  }

  const factors: RiskFactor[] = [];
  const recommendations: string[] = [];
  let totalScore = 0;

  // Factor 1: Overdue tasks (tasks not done, created > 7 days ago)
  const now = Date.now();
  const overdueTasks = tasks.filter(
    (t: any) => t.status !== 'DONE' && (now - new Date(t.createdAt).getTime()) > 7 * 86400000
  );
  const overdueRatio = overdueTasks.length / total;
  const overdueScore = Math.min(30, Math.round(overdueRatio * 100));
  if (overdueScore > 0) {
    factors.push({
      factor: 'Overdue Tasks',
      score: overdueScore,
      description: `${overdueTasks.length} task(s) are overdue (open for more than 7 days).`,
      severity: overdueScore > 20 ? 'HIGH' : overdueScore > 10 ? 'MEDIUM' : 'LOW',
    });
    recommendations.push(`Address ${overdueTasks.length} overdue task(s) to reduce project risk.`);
  }
  totalScore += overdueScore;

  // Factor 2: Task completion rate
  const completed = tasks.filter((t: any) => t.status === 'DONE').length;
  const completionRate = completed / total;
  const completionScore = Math.max(0, Math.round((1 - completionRate) * 25));
  factors.push({
    factor: 'Completion Rate',
    score: completionScore,
    description: `${Math.round(completionRate * 100)}% of tasks completed (${completed}/${total}).`,
    severity: completionRate < 0.3 ? 'HIGH' : completionRate < 0.6 ? 'MEDIUM' : 'LOW',
  });
  totalScore += completionScore;

  // Factor 3: Blocked/Backlog ratio
  const backlog = tasks.filter((t: any) => t.status === 'BACKLOG').length;
  const backlogRatio = backlog / total;
  const backlogScore = Math.min(20, Math.round(backlogRatio * 60));
  if (backlogScore > 5) {
    factors.push({
      factor: 'Backlog Size',
      score: backlogScore,
      description: `${backlog} task(s) still in backlog (${Math.round(backlogRatio * 100)}% of total).`,
      severity: backlogRatio > 0.5 ? 'HIGH' : 'MEDIUM',
    });
    recommendations.push('Review backlog items and prioritize or remove stale tasks.');
  }
  totalScore += backlogScore;

  // Factor 4: Critical/High priority unfinished tasks
  const criticalOpen = tasks.filter(
    (t: any) => (t.priority === 'CRITICAL' || t.priority === 'HIGH') && t.status !== 'DONE'
  ).length;
  const criticalScore = Math.min(25, criticalOpen * 5);
  if (criticalScore > 0) {
    factors.push({
      factor: 'Critical Open Tasks',
      score: criticalScore,
      description: `${criticalOpen} high/critical priority task(s) remain open.`,
      severity: criticalOpen > 3 ? 'CRITICAL' : criticalOpen > 1 ? 'HIGH' : 'MEDIUM',
    });
    recommendations.push(`Prioritize ${criticalOpen} critical/high priority task(s).`);
  }
  totalScore += criticalScore;

  const finalScore = Math.min(100, totalScore);
  const level = finalScore >= 70 ? 'CRITICAL' : finalScore >= 50 ? 'HIGH' : finalScore >= 25 ? 'MEDIUM' : 'LOW';

  if (recommendations.length === 0) {
    recommendations.push('Project is on track. Keep up the good work!');
  }

  return { score: finalScore, level, factors, recommendations };
}

export async function calculateProjectHealth(projectId: string): Promise<HealthResult> {
  const tasks = await Task.find({ project: projectId }).lean();
  const project = await Project.findById(projectId).lean();
  const total = tasks.length;

  const components: HealthComponent[] = [];

  // Delivery
  const completed = tasks.filter((t: any) => t.status === 'DONE').length;
  const deliveryScore = total > 0 ? Math.round((completed / total) * 100) : 100;
  components.push({ name: 'Delivery', score: deliveryScore, description: `${completed}/${total} tasks completed` });

  // Quality (based on subtask completion)
  const tasksWithSubs = tasks.filter((t: any) => t.subtasks && t.subtasks.length > 0);
  let qualityScore = 100;
  if (tasksWithSubs.length > 0) {
    const totalSubs = tasksWithSubs.reduce((sum: number, t: any) => sum + t.subtasks.length, 0);
    const completedSubs = tasksWithSubs.reduce(
      (sum: number, t: any) => sum + t.subtasks.filter((s: any) => s.isCompleted).length, 0
    );
    qualityScore = Math.round((completedSubs / totalSubs) * 100);
  }
  components.push({ name: 'Quality', score: qualityScore, description: 'Subtask completion rate' });

  // Team
  const members = (project as any)?.members?.length || 1;
  const activeTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const teamScore = Math.min(100, Math.max(20, 100 - Math.abs(activeTasks - members) * 15));
  components.push({ name: 'Team', score: teamScore, description: `${members} members, ${activeTasks} active tasks` });

  // Timeline
  const now = Date.now();
  const overdue = tasks.filter(
    (t: any) => t.status !== 'DONE' && (now - new Date(t.createdAt).getTime()) > 7 * 86400000
  ).length;
  const timelineScore = Math.max(0, 100 - overdue * 15);
  components.push({ name: 'Timeline', score: timelineScore, description: `${overdue} overdue tasks` });

  // Risk (inverse of risk score)
  const risk = await calculateProjectRisk(projectId);
  const riskScore = Math.max(0, 100 - risk.score);
  components.push({ name: 'Risk', score: riskScore, description: `Risk score: ${risk.score}/100` });

  const avgScore = Math.round(components.reduce((sum, c) => sum + c.score, 0) / components.length);
  const level = avgScore >= 80 ? 'HEALTHY' : avgScore >= 60 ? 'WARNING' : avgScore >= 40 ? 'AT_RISK' : 'CRITICAL';

  return { score: avgScore, level, components };
}
