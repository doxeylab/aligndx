# Design Philosophy

The React Frontend app follows this tree structure:

```
├── App.js
├── LoadContext.js
├── StyledGlobal.js
├── context-provider.js
├── http-common.js
├── index.js
├── assets 
│   └── Examplemedia.svg
├── components 
│   └── ExampleComponent
├── HOC
│   └── ExampleHoc
├── containers
│   └── ExampleContainer
├── pages 
│   └── Page.js
├── services
│   └── Service.js
└── styles
    └── ExampleStyles
```

Please place your code in the appropriate directory, as is described below:

1. Assets: Any media assets, such as svgs, json, images, etc
2. Components: Stateless, re-usable components, such as UI components; how things look
3. HOC: Higher order components, which wrap around components to create complex logic
    - Note: You can think of HOCs as the molecules built upon the atoms that are components. They rely on component(s) and extend their functionality
4. Containers: Stateful components, that are concerned with how things workers
5. Pages: Whenever you want to add a web-page, where most other directory code is being instantiated
6. Services: Miscellaneous
7. Styles: css, and other styling stuff

You can think of components as dumb pieces of code, that only serve to describe how to generate some piece of UI (example, a button). When you want to create a form, or a table that needs that button, create a higherorder component. Now you want to add some state to your UI! Ideally, you do this in the containers folder. Finally, we put it all together in the pages folder, where you add whatever components together, to generate some web-page. 

# KEEP IN MIND
Always aim to keep code modular if it is necessary. If you expect your code to be re-used many times within the app, seperate the logic so that it can be used in that manner. If it is a one-off/specific use-case, just keep the code within the scope of that file.