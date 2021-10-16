import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  store(@Body() userDTO: UserDTO) {
    return this.userService.store(userDTO);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.userService.find(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userDTO: UserDTO) {
    return this.userService.update(id, userDTO);
  }

  @Delete(':id')
  destroy(@Param('id') id: string) {
    return this.userService.destroy(id);
  }
}
