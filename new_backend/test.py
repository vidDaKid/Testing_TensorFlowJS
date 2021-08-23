import argparse, sys, json
import numpy as np

if __name__=='__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('string', type=str)
    args = parser.parse_args()

    s = json.loads(args.string) # {'one':'123'}
    s['one'] = list(np.array(list(s['one'])))
    print(json.dumps(s))
    sys.stdout.flush()
