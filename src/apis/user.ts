import api,{ResponseApi} from '@libs/apis/api'
import {IUser} from '@libs/types/user'


const config={
    withCredentials:true
}

export const users={
    getById: (userId: string) => api.get<ResponseApi<IUser>>(`/users/${userId}`, config),
}