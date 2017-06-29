const filter = fn => reducer => (sum, value) => fn(value) ? reducer(sum, value) : sum;
const mapper = fn => reducer => (sum, value) => reducer(sum, fn(value));
const takeUntil = fn => reducer => (sum, value) => fn(sum, value) ? reducer(sum, value) : false;

const compose = (...fns) => reducer => fns
	.slice()
	.reverse()
	.reduce((res, fn) => fn(res), reducer);

const transduce = (xform, reducer, initial, list, reduce) => 
	reduce(list, xform(reducer), initial);

const arrayReduce = (list, fn, initial) => {
	for (el of list) {
		const temp = fn(initial, el);
		if (temp === false) return initial;
		initial = temp;
	}
	return initial;		
}

const arrayReducer = (xs, x) =>(xs.push(x), xs);

const xform = compose(
	mapper(x => x + 1),
	filter(x => x % 2 === 0)
);

const xform2 = compose(
	mapper(x => x + 1),
	filter(x => x % 2 === 0),
	takeUntil((xs, x) => x <= 4)
);


console.log(
	transduce(xform, arrayReducer, [],  [1, 2, 3, 4, 5, 6, 7, 8, 9], arrayReduce),
	transduce(xform, arrayReducer, [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], arrayReduce),
	transduce(xform, (sum, x) => sum + x, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], arrayReduce),
	transduce(xform2, arrayReducer, [],  [1, 2, 3, 4, 5, 6, 7, 8, 9], arrayReduce),
	transduce(xform2, arrayReducer, [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], arrayReduce),
	transduce(xform2, (sum, x) => sum + x, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], arrayReduce),
)
