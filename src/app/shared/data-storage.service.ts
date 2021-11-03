import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private auth: AuthService) { }
    user: User;
    userToken: string;
    userAuth: Subscription
    
    storeRecipe() {
        const recipes = this.recipeService.getRecipes();

        this.http.put("https://hm-recipe-book-bc4e7-default-rtdb.firebaseio.com/recipes.json", recipes)
            .subscribe(resposeData => {
                console.log(resposeData);
            })
    }

    fetchRecipes() {


        return this.http.get<Recipe[]>("https://hm-recipe-book-bc4e7-default-rtdb.firebaseio.com/recipes.json")
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }), tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                }),
            )
        
        /* OPTIONAL OF ABOVE

        return this.auth.user.pipe(take(1),//take will take one subscribe value and then authomatic unscribe
            exhaustMap(user => {  //this 'exhaustMap' will first execute previouse(First above) observable and then replace new(below) one with previous one
                return this.http.get<Recipe[]>("https://hm-recipe-book-bc4e7-default-rtdb.firebaseio.com/recipes.json",
                    {
                        params: new HttpParams().set('auth', this.userToken)
                    });
            }), map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }), tap(recipes => {
                this.recipeService.setRecipes(recipes);
            }),
        )
        */
        

    }
}