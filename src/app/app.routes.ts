import { Routes } from '@angular/router';
import { TodoComponent } from './components/todo/todo.component';

export const routes: Routes = [
    {'path': 'todo', 'component': TodoComponent},
    //Redirecciona a la ruta "todo" si no se encuentra la ruta, "**" es para cualquier ruta
    {'path': '**', 'pathMatch': 'full', 'redirectTo': 'todo', },
];
