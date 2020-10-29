import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './domain/user';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('listusers')
    async listUsers(): Promise<User[] | null> {
        return await this.userService.listUsers();
    }

    @Post('createuser')
    async createUser(@Body() cat: User): Promise<User> {
        return await this.userService.createCustomUser(cat);
    }
}
