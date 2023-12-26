const update_state = (state, action) => {
    switch (action.type) {
        case 'init_state': {
            return {...action.payload}
        }
        case 'update_item': {
            const old_item = state[action.key]
            const new_item = {...old_item, ...action.payload}
            return {
                ...state,
                [action.key]: new_item
            }
        }
    }
    throw Error("Unknown action: " + action.type)
}

export const reducer_tg = (state, action) => {
    console.log("action_tg=", action)
    return update_state(state, action)
}

export const reducer_fb = (state, action) => {
    console.log("action_fb=", action)
    return update_state(state, action)
}

export const reducer_ig = (state, action) => {
    console.log("action_ig=", action)
    return update_state(state, action)
}

export const reducer_vk = (state, action) => {
    console.log("action_vk=", action)
    return update_state(state, action)
}
