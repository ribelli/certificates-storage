# Certificates Storage App
> Application for convenient storage and viewing of certificates


## Installation


### Clone

- Clone this repo to your local machine using `https://github.com/ribelli/certificates-storage.git`


### Development server

```bash
ng serve
```
- Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


### Build Project

```bash
ng build
```
- The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run 
```bash
ng test
```
- To execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run 
```bash
ng e2e
``` 
- To execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

---

### Built With

* [Angular](https://github.com/angular/angular) - The web framework used
* [RxJS](https://github.com/ReactiveX/rxjs) - Reactive Extensions For JavaScript
* [NGRX](https://github.com/ngrx/platform) - Reactive libraries for Angular

### Possible improvements

 - Add effects to NgRx in order to propagate changes from LocalStorage to Store;
 - Add some e2e and unit tests;
