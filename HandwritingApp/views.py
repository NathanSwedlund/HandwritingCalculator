from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
import base64

def home(request):
    return render(request, 'home.html')

@csrf_exempt
def postImage(request):
    if request.method == 'POST':
        if 'testVal' in request.POST:
            data = request.POST['testVal']
            data = data.split(';')[1]
            data = data.split(',')[1]
            body = base64.decodebytes(data.encode('utf-8'))

            # Writing to file
            WriteTxtFile = open(f"img/image.png", "wb")
            WriteTxtFile.write (bytearray(body))
            WriteTxtFile.close()

            # HERE WE SEND IT TO THINGS TO BE PARSED AND CLASSIFIED-------

            #-------------------------------------------------------------

            return HttpResponse('success') # if everything is OK
    # BAD
    return HttpRepsonse('ERROR ON LINE 27 on views.py')
