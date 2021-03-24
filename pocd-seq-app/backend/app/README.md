# Backend

Welcome to the backend source code. We're following the officially recommended guidlelines for structuring our backend application, as follows:

.
├── backend
│   ├── README.md
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies 
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   └── routers
│   │   ├── __init__.py
│   │   ├── results.py
│   │   ├── uploads.py
│   │   └── users.py 
│   ├── tests
│   └── venv
 

You'll notice that there are several empty __init__.py files throughout the app structure, in each folder. This is how python declares packages. Packages are a way of structuring modules. Say you have a program *foo* that does functions A, B, C and D. Then you realize that *foo* is getting way too complicated, so you need to split up those functions into seperate files for easier maintenance. Each of these files is referred to as a module. So where do packages fit in? Well if a module is a single python file, than a package is a collection of python modules. So here's what the structure of our package would look like:

.
├── __init__.py
├── foo
│   ├── __init__.py
│   ├── A.py
│   ├── B.py
│   ├── C.py
│   ├── D.py

So how do we use these functions? lets make a main.py file on the same level as our root directory, and in it, we input this code:

```python
from .foo import A, B, C, D

A()
B()
C()
D()
```
If you run `python3 main.py`, you will get this error: "ImportError: attempted relative import with no known parent package"
What's happening? Whenever we run any module in python, python's interpreter will define a few special variables, and one of note here is __package__ and __name__. When we execute main.py, the __package__ variable is set to None and __name__ variable is set to the variable __main__. If we peek at pythons definition for relative imports, it says:

>Relative imports use a module's name attribute to determine that module's position in the package hierarchy. If the module's name does not contain any package information (e.g. it is set to 'main') then relative imports are resolved as if the module were a top level module, regardless of where the module is actually located on the file system.

What does this mean? When we ran main.py, we ran it as a script. That's important because when we run python files as a script, its __name__ is set to __main__ and therefore python considers it as a module, not a package. So we can't use relative imports, because python doesn't consider this a package.
Remedy? W

> Oh god! It's a mess!
> - Manjot Hunjan