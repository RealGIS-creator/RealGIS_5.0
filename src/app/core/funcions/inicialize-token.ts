import { inject } from "@angular/core";
import { TokenService } from "../services/auth/token.service";
import { firstValueFrom } from "rxjs";

export function initializeToken(): Promise<void> {
    const tokenService = inject(TokenService);
    return tokenService.genexusToken();
}
