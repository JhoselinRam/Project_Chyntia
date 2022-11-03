# PROJECT : Chyntia
This is a experimental web-based science application intended to help students and teachers of physics and engineering courses to conduct real experiments with real sensors from a web browser.

Our goal is to provide reliable tools for real time data visualization and analysis of mechanical experiments using sensors based on arduino and raspberry pi.

This project uses next.js framework, d3, and python (pyodide) for the numerical processing.

### Road map
##### Basic expected functionality
- Real time data visualization from sensors connected via USB.
- Basic data analysis and manipulation tools (Integrals, derivatives, composition, etc)
- Free scripts and circuit schematics for arduino based sensors.

##### Future advance functionality
- Advance data analysis tools (Fourier analysis, statistical analysis, linear and nonlinear regression, model fit, etc)
- Data visualization draw form physics simulation instead of a sensor.
- Support for multiple sensors at once.
- API for custom sensors.
- 2D and 3D grhaper.
- Support for import and export work sessions.
___
## Start
To run this project clone the repository and open a terminal in the project root folder.
Run the command:
> npm install

Followed by the command:
> npm run dev

Alternatively the project can be run from a docker container if you cant or dont want to install node.

To run the project from a container open a terminal in the project root folder and execute the command:
> docker compose up -d

This command my need root privileges.
To stop the container run the command:
> docker compose down --volumes

Either way, the project must be available at [localhost:3000](http://localhost:3000 "localhost:3000")