import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todoList = signal< TodoModel[]>([
    { id: 1, title: 'Comprar arroz', completed: false, editing: false },
    { id: 2, title: 'Hacer trabajo 3D', completed: true, editing: false },
    { id: 3, title: 'Organizar calendario', completed: false, editing: false }
  ]);

  filter = signal<FilterType>('all');

  //Señal computada que filtra los todos segun el filtro seleccionado
  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todoList();

    switch (filter) {
      case 'inProgress':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  })
  

  newTodo = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  constructor() {
    effect(() => {
      // Al poner un signal y esa signal cambie, se ejecuta el efecto
      // Hay que setear un string con la lista de tareas
      // Se ejecuta el constructor, ngOnInit y luego effect
      localStorage.setItem('todos', JSON.stringify(this.todoList()))
    })
  }

  
  ngOnInit(): void {
    // 'todos' es el key que se le puso al localstorage en el effect
    const storage = localStorage.getItem('todos');
    // Se setea la lista de tareas con el valor del localstorage
    if(storage){
      this.todoList.set(JSON.parse(storage));
    }
  }

  // Función para reiniciar el local storage y cargar la lista predeterminada
  resetTodoList() {
    const defaultTodos = [
      { id: 1, title: 'Comprar arroz', completed: false, editing: false },
      { id: 2, title: 'Hacer trabajo 3D', completed: true, editing: false },
      { id: 3, title: 'Organizar calendario', completed: false, editing: false }
    ];
    localStorage.setItem('todoList', JSON.stringify(defaultTodos));
    this.todoList.set(defaultTodos);
  }

  changeFilter(filterString: FilterType){
    this.filter.set(filterString);
  }

  addTodo(){
    const newTodoTitle = this.newTodo.value.trim();
    if (this.newTodo.valid && newTodoTitle !== ''){
      this.todoList.update((prep_todos) => {
        const lastTodo = prep_todos.length > 0 ? prep_todos[prep_todos.length - 1] : { id: 0 };
        const newId = lastTodo.id + 1;
        return [
          ...prep_todos,
          { id: newId, title: newTodoTitle, completed: false }
        ]
      });
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  toggleTodo(todoId: number){
    return this.todoList.update((prev_todos) => 
      prev_todos.map((todo) => {
        // Si el id del todo es igual al id del todo, se cambia el valor de completed al contrario
        return todo.id === todoId 
        ? { ...todo, completed: !todo.completed } 
        : todo;
      })
    );
  }

  removeTodo (todoId: number){
    this.todoList.update((prev_todos) =>
      prev_todos.filter((todo) => todo.id !== todoId )
    );
  }

  updateTodo(todoId: number){
    return this.todoList.update((prev_todos) => 
      prev_todos.map((todo) => {
        // Si el id del todo es igual al id del todo, se cambia el valor de editing
        return todo.id === todoId 
        ? { ...todo, editing: true } 
        : { ...todo, editing: false };
      })
    );
  }

  saveTitleTodo(todoId: number, event: Event){
    const title = (event.target as HTMLInputElement).value;
    return this.todoList.update((prev_todos) => 
      prev_todos.map((todo) => {
        // Si el id del todo es igual al id del todo, se cambia el valor de title y editing false
        return todo.id === todoId 
        ? { ...todo, title: title, editing: false } 
        : todo;
      })
    );
  }
}