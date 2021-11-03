import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService,private router : Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => {
        this.id = +param['id'];
        this.editMode = (param['id'] != null);
        this.initForm()
      }
    )
  }

  private initForm() {


    let recipeName = '';
    let recipeImgPath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe.name;
      recipeImgPath = recipe.imagePath;
      recipeDesc = recipe.description;
      if (recipe['ingredients']) {

        console.log("Recipe has ingre");

        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'uom' : new FormControl(ingredient.uom, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            }
            )
          )
        }

        console.log(recipeIngredients);

      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDesc, Validators.required),
      'ingredients': recipeIngredients
    })

  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'uom' : new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onSubmit() {

    // const recipe = new Recipe(this.recipeForm.value['name'], this.recipeForm.value['description'],
    //                             this.recipeForm.value['imagePath'], this.recipeForm.value['ingredents']);
    if (this.editMode) {
      // this.recipeService.editRecipe(this.id,recipe);
      this.recipeService.editRecipe(this.id,this.recipeForm.value);
    }
    else{
      // this.recipeService.AddRecipe(recipe);
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancle();
  }

  onCancle(){
    this.router.navigate(["../"],{relativeTo: this.route});
  }

  onDeleteIncredient(index : number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
