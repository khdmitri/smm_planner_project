export const reducer_tg = (state, action) => {
    console.log("action=", action)
    switch (action.type) {
        case 'init_state': {
            return {...action.payload}
        }
        case 'update_item': {
            return {
                ...state,
                [action.key]: action.payload
            }
        }
    }
    throw Error("Unknown action: " + action.type)
}

export const reducer_fb = (state, action) => {
    console.log("action=", action)
    switch (action.type) {
        case 'init_state': {
            return {...action.payload}
        }
        case 'update_item': {
            return {
                ...state,
                [action.key]: action.payload
            }
        }
    }
    throw Error("Unknown action: " + action.type)
}

export const reducer_vk = (state, action) => {
    console.log("action=", action)
    switch (action.type) {
        case 'init_state': {
            return {...action.payload}
        }
        case 'update_item': {
            return {
                ...state,
                [action.key]: action.payload
            }
        }
    }
    throw Error("Unknown action: " + action.type)
}
