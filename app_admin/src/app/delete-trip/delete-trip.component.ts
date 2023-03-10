import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-delete-trip',
  templateUrl: './delete-trip.component.html',
  styleUrls: ['./delete-trip.component.css']
})
export class DeleteTripComponent implements OnInit {

  deleteForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit() {
    // retrieve tripId
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something is wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('DeleteTripComponent#onInit found tripCode' + tripCode);

    // initialize form
    this.deleteForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    })

    console.log('DeleteTripComponent#onInit calling TripDataService#getTrip(\'' + tripCode + '\')');

    this.tripService.getTrip(tripCode)
      .then(data => {
        console.log(data);
        // Don't use editForm.setValue() as it will throw an error
        this.deleteForm.patchValue(data[0]);
      })
  }
  onSubmit() {
    this.submitted = true;

    if (this.deleteForm.valid) {
      this.tripService.removeTrip(this.deleteForm.value)
      this.router.navigate(['list-trips']);
    }
  }
}
