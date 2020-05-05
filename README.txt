Final Project for Pattern Recognition

Description:
	This project is a handwriting caclulator. It takes hadnwritten math expressions from the HTML5 
	canvas and solves them. See the presentations for more details.


Authors: Nathan Swedlund and Brighton Mica
Date: 05/04/20

Branches:
	We have many branches that have different things. Most of the work
	in these branches failed to produce good results. Master is the culmination.

Project Structure:
	- Data/ - contains CSV files for Math and MNIST Dataset
	- Jupyter/ - contains all Jupyter related work
	- Jupyter/Classifier/
		.../Classifiers.ipynb - contains classifier visualization
		.../FutherTesting.ipynb - further classifier validation
		../Old/ - ways of doing this that didn't work (not documented)
	- Jupyter/Segmentation - contains segmenting visualization
	- Website/Calc/ - contains all website code
	- Website/Calc/views.py - contains connection with segemter and classifier
	- Website/Calc/python - contains pickled classifiers and segmenting code

Dependencies:
	- Various python packages (Django, cv2, sklearn, etc.)

Running the Website:
	- Clone the repo
	- cd into Website (contains "manage.py")
	- run "python manage.py runserver"
	- go to the URL mentioned in the terminal (should be something along 
	  the lines of http://127.0.0.1:8000/). Add Calc/ to the url. 
	- You should now be on the website

