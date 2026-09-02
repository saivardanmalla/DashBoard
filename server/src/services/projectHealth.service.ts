import { Types } from 'mongoose';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { ProjectHealthHistory } from '../models/ProjectHealthHistory';
import { Risk } from '../models/Risk';

class ProjectHealthService {
  async calculateHealthScore(projectId: string | Types.ObjectId) {
    const pId = new Types.ObjectId(projectId);
    
    // Fetch data
    const project = await Project.findById(pId);
    if (!project) throw new Error('Project not found');

    const tasks = await Task.find({ project: pId });
    const risks = await Risk.find({ projectId: pId, status: 'OPEN' });

    // 1. Task Score (30% weight)
    const taskScore = this.calculateTaskScore(tasks);
    
    // 2. Deadline Score (20% weight) - simplified for now
    const deadlineScore = this.calculateDeadlineScore(tasks);
    
    // 3. Workload Score (20% weight)
    const workloadScore = this.calculateWorkloadScore(tasks);
    
    // 4. Risk Score (20% weight)
    const riskScore = this.calculateRiskScore(risks);
    
    // 5. Activity Score (10% weight)
    const activityScore = 85; // Placeholder for activity, could use Activity model

    const finalScore = Math.round(
      (taskScore * 0.3) + 
      (deadlineScore * 0.2) + 
      (workloadScore * 0.2) + 
      (riskScore * 0.2) + 
      (activityScore * 0.1)
    );

    // Save to history
    const history = new ProjectHealthHistory({
      projectId: pId,
      score: finalScore,
      taskScore,
      deadlineScore,
      workloadScore,
      riskScore,
      activityScore,
    });
    
    await history.save();

    return history;
  }

  private calculateTaskScore(tasks: any[]): number {
    if (tasks.length === 0) return 100;
    const completed = tasks.filter(t => t.status === 'DONE').length;
    return Math.round((completed / tasks.length) * 100);
  }

  private calculateDeadlineScore(tasks: any[]): number {
    // Basic heuristic: if there are many tasks in BACKLOG/TODO vs DONE
    if (tasks.length === 0) return 100;
    const pending = tasks.filter(t => ['BACKLOG', 'TODO'].includes(t.status)).length;
    const penalty = pending * 2; // Subtract 2 points per pending task
    return Math.max(0, 100 - penalty);
  }

  private calculateWorkloadScore(tasks: any[]): number {
    // Simplify: too many IN_PROGRESS tasks means team is overloaded
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    if (inProgress > 10) return 50; // Overloaded
    if (inProgress > 5) return 75; // Heavy
    return 95; // Healthy
  }

  private calculateRiskScore(risks: any[]): number {
    if (risks.length === 0) return 100;
    
    let penalty = 0;
    risks.forEach(risk => {
      switch (risk.severity) {
        case 'CRITICAL': penalty += 30; break;
        case 'HIGH': penalty += 20; break;
        case 'MEDIUM': penalty += 10; break;
        case 'LOW': penalty += 5; break;
      }
    });

    return Math.max(0, 100 - penalty);
  }
}

export const projectHealthService = new ProjectHealthService();
