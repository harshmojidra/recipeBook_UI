import {  Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {

  recipeChanged = new Subject<Recipe[]>();

 

  // private recipes: Recipe[]
  //  = [
  //   new Recipe(
  //     'Vada Pav' ,
  //     'Spicy' ,
  //     'https://static.eazydiner.com/resized/720X280/restaurant%2F662529%2Frestaurant020190323075132.png',
  //     [
  //       new Ingredient('Potato', 2),
  //       new Ingredient('Ginger', 1),
  //       new Ingredient('Garlic', 1),
  //       new Ingredient('Bun', 1)
  //     ]),
  //   new Recipe(
  //     'Dabeli' ,
  //     'Sweet-spicy' ,
  //     'https://image.shutterstock.com/image-photo/closeup-two-beautifully-plated-dabeli-260nw-1254841312.jpg',
  //     [
  //       new Ingredient('Bun', 1),
  //       new Ingredient('Boiled potato', 1)
  //     ])
  // ];

  private recipes: Recipe[] =  [];
  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes:Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(index : number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  editRecipe(index:number, newRecipe : Recipe)
  {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  addRecipe(newRecipe : Recipe)
  {
    this.recipes.push(newRecipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index:number)
  {
    this.recipes.splice(index,1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
