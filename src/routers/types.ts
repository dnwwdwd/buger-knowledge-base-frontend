import type {
  _Awaitable,
  NavigationGuardNext,
  NavigationGuardReturn,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';

export type NavigationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
) => _Awaitable<NavigationGuardReturn>;
