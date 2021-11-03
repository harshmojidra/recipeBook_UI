import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {


  private userSub: Subscription;
  isAuthenticate: boolean = false;
  private recipes: Recipe[] =  [];
  lessRecipeError : string = null;
  userAccessError : string = null;
  isLessRecipeError: boolean = false;
  isUserAccessError: boolean = false;
  user : User;

  constructor(private dataService: DataStorageService, private auth: AuthService,private recipeService : RecipeService) { }

  ngOnInit(): void {

    this.userSub = this.auth.user.subscribe(user => {
      // this.isAuthenticate = !user ? false : true
      this.isAuthenticate = !!user;
      this.user = user;
      console.log(!user);
      console.log(!!user);
    })

  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {

    this.recipes = this.recipeService.getRecipes();
    

    if(this.user.email !== "harsh@gmail.com")
    {
      if(this.recipes.length < 1){
        this.isLessRecipeError=true;
        this.lessRecipeError = "Minimum Recipe should be 3"
      }
      console.log("Not harsh");
      
      this.isUserAccessError = true;
      this.userAccessError = "Sorry ! You do not have access to update Recipe !"
    }else{
      this.dataService.storeRecipe();
    }

    
  }

  onFetchData() {
    this.dataService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.auth.logout();
  }

  onHandleError() {
    this.isUserAccessError = null;
    this.userAccessError = null;
  }

}
