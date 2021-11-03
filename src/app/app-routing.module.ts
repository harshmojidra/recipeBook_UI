import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeResolverService } from "./recipes/recipe-resolver.service";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoute: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    // {
    //     path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
    //         { path: '', component: RecipeStartComponent },
    //         { path: 'new', component: RecipeEditComponent },
    //         { path: ':id', component: RecipeDetailComponent },
    //         { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService] },
    //     ]
    // },
    {
        path: "recipes",
        loadChildren: () =>
          import("./recipes/recipes.module").then(m => m.RecipesModule)
     },
     {
        path: "shopping-list",
        loadChildren: () =>
          import("./shopping-list/shopping-list.module").then(
            m => m.ShoppingListModule
          )
      },
      {
        path: "auth",
        loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
      }
]


@NgModule({
    imports: [RouterModule.forRoot(appRoute,{preloadingStrategy : PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}