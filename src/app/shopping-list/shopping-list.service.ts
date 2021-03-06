import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  
  ingredientsChanged = new Subject<Ingredient[]>();
  editIngredientIndex = new Subject<number>();
  
  private ingredients: Ingredient[] = [
    new Ingredient('Apples','gram', 500),
    new Ingredient('Tomatoes','gram', 100)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredientsByIndex(index:number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index : number , newIngrd : Ingredient){
    this.ingredients[index] = newIngrd;
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(index : number){
    this.ingredients.splice(index,1);
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
