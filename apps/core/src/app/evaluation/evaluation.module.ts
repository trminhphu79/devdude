import { Module } from '@nestjs/common';
import { RankingModule } from './ranking/ranking.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [RankingModule, ScoreModule]
})
export class EvaluationModule {}
