export default LikeReducer = (currentState, action) => {
    switch (action.type) {
        case "inc":
            return currentState + action.payload;
    }

    return currentState;
}