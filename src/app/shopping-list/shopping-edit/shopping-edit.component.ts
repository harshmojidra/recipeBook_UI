import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit , OnDestroy{

  @ViewChild('shoppingListEditForm', { static: false }) shoppingListEditForm: NgForm;
  ingredient : Ingredient;
  ingredientIndex: number;
  isIngredientEdit: boolean = false;
  ingreEditSubscription: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {

    this.ingreEditSubscription = this.slService.editIngredientIndex.subscribe(
      (index: number) => {
        this.ingredientIndex = index;
        this.isIngredientEdit = true;

        this.ingredient = this.slService.getIngredientsByIndex(index);
        this.shoppingListEditForm.setValue({
          name : this.ingredient.name,
          amount : this.ingredient.amount,
          uom : this.ingredient.uom
        })
      }
    )

    
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.uom,value.amount);

    if(this.isIngredientEdit){
      this.slService.updateIngredient(this.ingredientIndex , newIngredient);
    }
    else{
      this.slService.addIngredient(newIngredient);
    }

    this.shoppingListEditForm.reset();
    this.isIngredientEdit = false;
  }

  ngOnDestroy(): void {
    this.ingreEditSubscription.unsubscribe();
  }

  onClear()
  { 
    this.shoppingListEditForm.reset();
    this.isIngredientEdit = false;
  }

  onDelete(){
    this.onClear();
    this.slService.deleteIngredient(this.ingredientIndex);
  }

}
