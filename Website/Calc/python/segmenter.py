# General
import numpy as np
import matplotlib.pyplot as plt
import math

# Image Processing
import cv2
import imutils
from imutils import contours
from PIL import Image
from scipy import ndimage

# File
import os
import glob
import pickle

# Classifying
from sklearn.datasets import load_digits
from sklearn import neighbors
from sklearn import neural_network
from sklearn import preprocessing



IMAGE_PADDING = 4


def convert_to_grayscale(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def apply_gaussian_blur(img):
    return cv2.GaussianBlur(img, (3, 3), 1)


def apply_threshold(img):
    _, img = cv2.threshold(img, 120, 255, cv2.THRESH_BINARY_INV)
    return img


def dilate(img, rows=1, cols=1, i=1):
    return cv2.dilate(img, np.ones((rows, cols), np.uint8), iterations=i)


def close(img, rows=1, cols=1):
    return cv2.morphologyEx(img, cv2.MORPH_CLOSE, np.ones((rows, cols), np.uint8))


def get_contours(img, rows=1, cols=1):
    cnts, _ = cv2.findContours(
        img.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if len(cnts) == 0:
        return cnts
    cnts = contours.sort_contours(cnts, method="left-to-right")[0]
    return cnts


def get_characters(img, cnts):
    chars = []
    for cnt in cnts:

        # Bounding rect
        (x, y, w, h) = cv2.boundingRect(cnt)
        chars.append((x, y, w, h, img[y:y+h, x:x+w]))

    return np.asarray(chars)


def shape(img):

    h, w = img.shape
    aspect_ratio = w/h

    if aspect_ratio < 0.95:
        padding = (h - w) // 2

        # Add width padding to create even aspect ratio
        img = cv2.copyMakeBorder(
            img, 0, 0, padding, padding, cv2.BORDER_CONSTANT, value=(0, 0, 0))

    elif aspect_ratio > 1.05:
        padding = (w - h) // 2

        # Add width padding to create even aspect ratio
        img = cv2.copyMakeBorder(
            img, padding, padding, 0, 0, cv2.BORDER_CONSTANT, value=(0, 0, 0))

    # Resize
    img_size = 45 - IMAGE_PADDING * 2
    img = cv2.resize(img, (img_size, img_size))

    # add padding
    img = cv2.copyMakeBorder(img, IMAGE_PADDING, IMAGE_PADDING, IMAGE_PADDING,
                             IMAGE_PADDING, cv2.BORDER_CONSTANT, value=(0, 0, 0))
    return img


def reshape1(img, cnts):
    resized_chars = []
    chars = get_characters(img, cnts)
    for char in chars:
        char = char[4]
        h, w = char.shape
        aspect_ratio = w/h

        if aspect_ratio < 0.95:
            padding = (h - w) // 2

            # Add width padding to create even aspect ratio
            char = cv2.copyMakeBorder(
                char, 0, 0, padding, padding, cv2.BORDER_CONSTANT, value=(0, 0, 0))

        elif aspect_ratio > 1.05:
            padding = (w - h) // 2

            # Add width padding to create even aspect ratio
            char = cv2.copyMakeBorder(
                char, padding, padding, 0, 0, cv2.BORDER_CONSTANT, value=(0, 0, 0))

        # Resize
        char_size = 45 - IMAGE_PADDING * 2
        char = cv2.resize(char, (char_size, char_size))

        # add padding
        char = cv2.copyMakeBorder(char, IMAGE_PADDING, IMAGE_PADDING, IMAGE_PADDING,
                                  IMAGE_PADDING, cv2.BORDER_CONSTANT, value=(0, 0, 0))

        resized_chars.append(char)
    return np.asarray(resized_chars)


# CREDIT: https://opensourc.es/blog/tensorflow-mnist
# def reshape2(img, cnts):
#     chars = get_characters(img, cnts)
#     resized_chars = []
#     for ax, char in zip(axs.flat, chars):
#         char_img = char[4]
#         rows, cols = char_img.shape

#         if rows > cols:
#             factor = 20 / rows
#             rows = 20
#             cols = int(round(cols*factor))
#             char_img = cv2.resize(char_img, (cols, rows))
#         else:
#             factor = 20.0/cols
#             cols = 20
#             rows = int(round(rows*factor))
#             char_img = cv2.resize(char_img, (cols, rows))

#         colsPadding = (int(math.ceil((45-cols)/2.0)),
#                        int(math.floor((45-cols)/2.0)))
#         rowsPadding = (int(math.ceil((45-rows)/2.0)),
#                        int(math.floor((45-rows)/2.0)))
#         char_img = np.lib.pad(char_img, (rowsPadding, colsPadding), 'constant')
#         resized_chars.append(char_img)
#         ax.imshow(char_img, cmap="Greys_r")

#     resized_chars = np.asarray(resized_chars)


def segment_and_classify(img_loc, image_num):
    # Classifier
    clf = None
    with open("Calc/python/clf.pk", 'rb') as fin:
        clf = pickle.load(fin)

    img = cv2.imread(img_loc)

    # Grayscale
    img = convert_to_grayscale(img)

    # Threshold
    img = apply_threshold(img)

    # Contours
    cnts = get_contours(img)

    # Case: stop if the canvas is empty
    if len(cnts) == 0:
        return ""

    # Reshaping
    chars = reshape1(img, cnts)

    # Write images to folder
    os.mkdir(f"Calc/img/seg_img_{image_num}")
    for i, char in enumerate(chars):
        cv2.imwrite(f"Calc/img/seg_img_{image_num}/{i}.png", char)

    sc = preprocessing.StandardScaler()
    # sc_train_X = sc.fit_transform(train_X)
    # Classify
    expression = ""
    for char in chars:
        print(char.shape)

        sc_char = sc.fit_transform(char)

        # cl = [char.ravel()]
        # sc_cl = sc.fit_transform(cl)
        # print("SC ", sc_cl)
        # pred = clf.predict(sc_cl)[0]

        pred = clf.predict([sc_char.ravel()])[0]
        # pred = clf.predict([char.ravel()])[0]

        if(pred == ","):
            pred = '/'

        expression += pred

    try:
        answer = str(eval(expression.replace(")(", ")*(")))
    except:
        answer = "Could not parse"

    return expression+" = "+answer
