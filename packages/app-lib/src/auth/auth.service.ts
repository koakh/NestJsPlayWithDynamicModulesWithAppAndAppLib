import { Inject, Injectable } from "@nestjs/common";
import { AppServiceAbstract, UserServiceAbstract } from "./auth.abstracts";
import { adminCurrentUser, APP_SERVICE, AUTH_MODULE_OPTIONS, AUTH_MODULE_USER_SERVICE } from './auth.constants';
import { AuthModuleOptions } from './auth.interfaces';
import { AuthStore } from "./auth.store";
import { AuthUser as User } from './types';

@Injectable()
export class AuthService {

  private authStore: AuthStore;

  constructor(
    @Inject(APP_SERVICE)
    private readonly appService: AppServiceAbstract,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly authModuleOptions: AuthModuleOptions,
    @Inject(AUTH_MODULE_USER_SERVICE)
    private readonly userService: UserServiceAbstract,
  ) {
    this.authStore = new AuthStore();
  }

  addUser(username: string, tokenVersion: number): { username: string, tokenVersion: number } {
    this.authStore.addUser(username, tokenVersion);
    return { username, tokenVersion: this.authStore.getTokenVersion(username) };
  }

  incrementTokenVersion(username: string): { username: string, tokenVersion: number } {
    return { username, tokenVersion: this.authStore.incrementTokenVersion(username) };
  }

  getConfig(): AuthModuleOptions {
    return this.authModuleOptions;
  }

  // this is from consumer app AppModule/AppService
  getHelloAppModule(): { message: string } {
    return { message: `${this.appService.getHello()} (called in AuthService.etHelloAppModule())` };
  }

  // this is from consumer app AppModule/UserService
  getUserFindOneByField(): Promise<User> {
    return this.userService.findOneByField('username', 'admin', adminCurrentUser);
  }
}
