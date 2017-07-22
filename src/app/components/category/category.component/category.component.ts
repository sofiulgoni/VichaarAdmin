import { Component, ViewChild, OnInit } from '@angular/core';

import { Category } from '../category.model/category.model';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @ViewChild('editModal') editModal;

  categoryList : any;
  categoryListData : any;
  category = new Category();

  constructor(private firebase : FirebaseService) { }

  ngOnInit() {
    this.categoryList = this.firebase.getCategoryList();
    this.categoryList.subscribe(categoryList => {
      this.categoryListData = categoryList;
    });
  }

  public openCategoryDetails(key){
    if(this.categoryListData != undefined && this.categoryListData.length > 0 && key != undefined){
      this.category = this.categoryListData.find(category => category.$key == key);
      this.editModal.show();
    }
  }

  public hideEditModal(){
    this.editModal.hide();
    this.category = new Category();
  }

  public addCategory(){
    if(this.category.name != ""){
      console.log("Add Category Added");
      this.firebase.addCategory(this.category);
      this.category.name = "";
    }
  }

  public updateCategory(){
    this.firebase.updateCategory(this.category);
    this.hideEditModal();
  }

}
