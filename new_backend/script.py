import numpy as np
import json, sys, argparse
from PIL import Image, ImageOps

img_size = 500
surrounding_val = 0.5
full_val = 1

# Takes in a string of coordinates(json string) and returns a json object of the CNN input
    # '{"input": [...]}'
if __name__=='__main__':
    # Set up arguments to get the string
    parser = argparse.ArgumentParser(description='Send the string')
    parser.add_argument('string')
    args = parser.parse_args()
    # st:str
    # with open('main.py', 'r') as f:
        # st = f.read()
    data = json.loads(args.string)
    points = data['lines'][0]['points']
    # Create a 300x300 np array that will be the image
    n = np.zeros(shape=(img_size,)*2)
    for i in points:
        x = round(i['x'])
        x = min(img_size-1, x) if x>0 else 0

        y = round(i['y'])
        y = min(img_size-1, y) if y>0 else 0

        n[y,x] = full_val
        # Add some color to the surrounding pixels so that the number comes out more whole
        if x<img_size-1 and y<img_size-1:
            n[y+1,x+1] = surrounding_val
            n[y,x+1] = surrounding_val
            n[y+1,x] = surrounding_val
        if x>0 and y>0:
            n[y-1,x-1] = surrounding_val
            n[y,x-1] = surrounding_val
            n[y-1,x] = surrounding_val

    # Return this array to the server
    list_n = n.tolist()
    # print(str(n))
    print(json.dumps({'input':list_n}))
    sys.stdout.flush()
    # Turn n insto a grayscale image array
    n = (n*255).astype(np.uint8)
    # Get the corresponding image
    im = Image.fromarray(n)
    im.show()
    # SAve temporarily
    # im.save('drawn_3.jpeg')
