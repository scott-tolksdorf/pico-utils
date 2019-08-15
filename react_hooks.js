
const useLocalState = (init, key)=>{
	if(!key) throw `Must set a 'key' for local state hook`;
	const [val, setVal] = React.useState(init);
	React.useEffect(()=>{
		try { setVal(JSON.parse(window.localStorage.getItem(key))); } catch (err){}
	}, []);
	return [val, (newVal)=>{
		typeof window !== 'undefined' && window.localStorage.setItem(key, JSON.stringify(newVal));
		setVal(newVal);
	}];
};

const onMount = (mountFn=()=>{})=>{
	const mounted = React.useRef(false);
	React.useEffect(()=>{
		mounted.current = true;
		mountFn();
	}, []);
	return mounted.current;
};

const useAsync = (asyncFn)=>{
	const [result, setResult] = React.useState();
	const [status, setStatus] = React.useState({ pending : false, errors : null });
	const execute = async (...args)=>{
		setStatus({ pending : true, errors : null });
		return asyncFn(...args)
			.then((res)=>{
				setStatus({ pending : false, errors : null });
				setResult(res);
			})
			.catch((err)=>{
				setStatus({ pending : false, errors : err });
			});
	}
	return [ execute, result, status ];
};
