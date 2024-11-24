import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from './employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dnc autocomplete';

  countries: { id: number, name: string, code: string }[] = [];
  languages: { id: number, name: string, code: string }[] = [];
  projects: { id: number, name: string, status: string }[] = [];
  departments: { id: number, name: string }[] = [];

  roles: string[] = [
    "Software Developer",
    "Project Manager",
    "Quality Assurance Engineer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Business Analyst",
    "Product Manager",
    "Database Administrator",
    "System Administrator",
    "Cybersecurity Specialist"
  ];


  // Reactive

  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { this.buildForm(); }

  private buildForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      role: ['', Validators.required],
      language: ['' , Validators.required],
      project: ['', Validators.required],
      departmentId: [0 , Validators.required],
    });
  };


  employees: Employee[] = [];

  createEmployee(): void {
    if (this.employeeForm.valid) {
      console.log("this.employeeForm.value" + this.employeeForm.value);
      this.employees.push(this.employeeForm.value);
    }
  }

  reset(): void {
    this.employeeForm.reset();
  }


  ngOnInit(): void {
    this.loadData<{ id: number, name: string, code: string }[]>('countries.json', data => this.countries = data);
    this.loadData<{ id: number, name: string }[]>('departments.json', data => this.departments = data);
    this.loadData<{ id: number, name: string, code: string }[]>('languages.json', data => this.languages = data);
    this.loadData<{ id: number, name: string, technologies: string[], status: string }[]>('projects.json', data => this.projects = data);
  }

  private loadData<T>(url: string, callback: (data: T) => void): void {
    this.http.get<T>(url).subscribe(callback, error => console.error(`Error loading data from ${url}:`, error));
  }

  onItemSelected(selectedItem: any) {
    console.log('Selected item:', selectedItem);
  }

  // Template driven
  selectedCourse = null;

  courses: { id: number, name: string, code: string }[] = [
    { id: 1, name: "Introduction to Programming", code: "CS101" },
    { id: 2, name: "Data Structures and Algorithms", code: "CS102" },
    { id: 3, name: "Web Development Basics", code: "CS103" },
    { id: 4, name: "Database Systems", code: "CS104" },
    { id: 5, name: "Software Engineering Principles", code: "CS105" },
  ];

  // Standalone usage
  selectedProgram = null;


  programs: { id: number, name: string, code: string }[] = [
    { id: 1, name: "Computer Science", code: "CS101" },
    { id: 2, name: "Electrical Engineering", code: "EE202" },
    { id: 3, name: "Mechanical Engineering", code: "ME303" },
    { id: 4, name: "Civil Engineering", code: "CE404" },
    { id: 5, name: "Data Science", code: "DS505" },
  ];

  onProgramSelected(program: any) {
    this.selectedProgram = program.name;
  }
}
