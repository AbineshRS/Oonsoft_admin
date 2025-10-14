import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-chekout-list',
  imports: [CommonModule],
  templateUrl: './view-chekout-list.html',
  styleUrl: './view-chekout-list.css'
})
export class ViewChekoutList implements OnInit {

  checkoutlistId: any;
  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.checkoutlistId = this.router.snapshot.paramMap.get('id')!;
  }

  
}
