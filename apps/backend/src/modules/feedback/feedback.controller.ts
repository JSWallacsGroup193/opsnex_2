import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, QueryFeedbackDto } from './dto/feedback.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit feedback' })
  async create(@Request() req, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(req.user.tenantId, req.user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all feedback (Admin only)' })
  async findAll(@Request() req, @Query() query: QueryFeedbackDto) {
    return this.feedbackService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feedback by ID (Admin only)' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.feedbackService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update feedback status (Admin only)' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(req.user.tenantId, id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete feedback (Admin only)' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.feedbackService.remove(req.user.tenantId, id);
  }

  @Get('stats/summary')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feedback statistics (Admin only)' })
  async getStats(@Request() req) {
    return this.feedbackService.getStats(req.user.tenantId);
  }
}
