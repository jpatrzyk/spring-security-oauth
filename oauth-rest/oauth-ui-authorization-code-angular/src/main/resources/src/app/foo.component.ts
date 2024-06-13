import { Component } from '@angular/core';
import {AppService, Foo} from './app.service'

@Component({
  selector: 'foo-details',
  providers: [AppService],
  template: `<div class="container">
    <h1 class="col-sm-12">Customers Details</h1>
    <div class="col-sm-12">
        <label class="col-sm-3">ID</label> <span>{{foo.id}}</span>
    </div>
    <div class="col-sm-12">
        <label class="col-sm-3">Name</label> <span>{{foo.name}}</span>
    </div>
    <div class="col-sm-12">
        <button class="btn btn-primary" (click)="getFoo()" type="submit">GET Customers</button>
    </div>
</div>`
})

export class FooComponent {
    public foo = new Foo('1', 'sample foo');
    private foosUrl: string

    constructor(private _service: AppService) {
      this.foosUrl = this._service.resourceServerBaseUrl + '/customers';
    }

    getFoo() {
        this._service.getResource(this.foosUrl)
         .subscribe(
                     data => this.foo = data[0],
                     error =>  this.foo.name = 'Error');
    }
}
