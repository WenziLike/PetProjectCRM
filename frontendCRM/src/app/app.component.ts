import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "./employee.service";
import {Employee} from "./employee";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public employees: Employee[] | undefined;
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response)
        this.getEmployees()
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      },
    )
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    // container.appendChild(button);
    button.click();
    if (container === null) {
      alert('oops');
    } else {
      container.appendChild(button);
      button.click();
      // since you've done the nullable check
      // TS won't complain from this point on

    }
  }
}

