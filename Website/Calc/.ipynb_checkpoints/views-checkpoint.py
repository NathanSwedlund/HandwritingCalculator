# Django
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt

# General
import os
import base64

# Custom
from Calc.python import segmenter


# Number of next image to be posted and saved
img_num = len([f for f in os.listdir("Calc/img") if f[-4:] == ".png"])


@csrf_exempt
def index(request):
    print("INDEX")
    if request.method == "GET":
        print("View - Index GET")
        return render(request, "index.html", {})
    elif request.method == "POST":
        print("View - Index POST")

        # Convert to image
        img = request.POST.get("img")
        img = img.split(';')[1]
        img = img.split(',')[1]
        body = base64.decodebytes(img.encode('utf-8'))

        # Write to file
        global img_num
        img_loc = f"Calc/img/image_{img_num}.png"
        WriteTxtFile = open(img_loc, "wb")
        WriteTxtFile.write(bytearray(body))
        WriteTxtFile.close()
        
        return HttpResponse(content="Placeholder")

        # Segment and Classify
#         expression = segmenter.segment_and_classify(img_loc, img_num)
#         img_num += 1

#         if expression.isspace() or expression == "":
#             return HttpResponse(content="Please more input before hitting submit")

#         print("Expression not empty |"+expression+"|")
#         return HttpResponse(content=expression)
