import classNames from 'classnames'
import { QueryConfig } from '../../pages/ProductList/ProductList'
import { Link, createSearchParams } from 'react-router-dom'
import pathUrl from '../../constants/pathUrl'

interface PaginationProps {
  queryConfig: QueryConfig
  pageSize: number
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

const RANGE = 2

export default function Pagination({ queryConfig, pageSize }: PaginationProps) {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span
            key={index}
            className='mx-2 rounded border bg-white px-3 py-2 text-gray-500  shadow-sm hover:bg-gray-200'
          >
            ...
          </span>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span
            key={index}
            className='mx-2 rounded border bg-white px-3 py-2 text-gray-500  shadow-sm hover:bg-gray-200'
          >
            ...
          </span>
        )
      }
      return null
    }

    return Array.from({ length: pageSize }).map((_, index) => {
      const pageNumber = index + 1
      // điều kiện render ...
      if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
        return renderDotAfter(index)
      } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
        if (pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index)
        } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        }
      } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
        return renderDotBefore(index)
      }

      return (
        <Link
          to={{
            pathname: pathUrl.home,
            search: createSearchParams({
              ...queryConfig,
              page: pageNumber.toString()
            }).toString()
          }}
          key={index}
          className={classNames(
            `mx-2 cursor-pointer rounded border bg-white px-3 py-2 text-gray-500  shadow-sm hover:bg-gray-200`,
            {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            }
          )}
          // onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </Link>
      )
    })
  }
  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      <Link
        to={{
          pathname: pathUrl.home,
          search: createSearchParams({
            ...queryConfig,
            page: (page - 1).toString()
          }).toString()
        }}
        className={classNames('mx-2  rounded border bg-white px-3 py-2 text-gray-500  shadow-sm ', {
          'pointer-events-none': page === 1,
          'cursor-not-allowed': page === 1,
          'hover:bg-gray-200': page !== 1
        })}
      >
        Prev
      </Link>
      {renderPagination()}
      <Link
        to={{
          pathname: pathUrl.home,
          search: createSearchParams({
            ...queryConfig,
            page: (page + 1).toString()
          }).toString()
        }}
        className={classNames('mx-2 rounded border bg-white px-3 py-2 text-gray-500  shadow-sm ', {
          'cursor-not-allowed': page === pageSize,
          'pointer-events-none': page === pageSize,
          'hover:bg-gray-200': page !== pageSize
        })}
      >
        Next
      </Link>
    </div>
  )
}
