import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import pathUrl from '../constants/pathUrl'
import { Schema, schema } from '../libs/rules'
import useQueryConfig from './useQueryConfig'

type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const navigate = useNavigate()
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : omit({
          ...queryConfig,
          name: data.name
        })
    navigate({
      pathname: pathUrl.home,
      search: new URLSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
