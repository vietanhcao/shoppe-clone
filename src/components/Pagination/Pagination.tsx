import classNames from 'classnames'

interface PaginationProps {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
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

export default function Pagination({ page, setPage, pageSize }: PaginationProps) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button
            key={index}
            className='mx-2 px-3 py-2 bg-white text-gray-500 hover:bg-gray-200 rounded shadow-sm  cursor-pointer border'
          >
            ...
          </button>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button
            key={index}
            className='mx-2 px-3 py-2 bg-white text-gray-500 hover:bg-gray-200 rounded shadow-sm  cursor-pointer border'
          >
            ...
          </button>
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
        <button
          key={index}
          className={classNames(
            `mx-2 px-3 py-2 bg-white text-gray-500 hover:bg-gray-200 rounded shadow-sm  cursor-pointer border`,
            {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            }
          )}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </button>
      )
    })
  }
  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      <button className='mx-2 px-3 py-2 bg-white text-gray-500 hover:bg-gray-200 rounded shadow-sm  cursor-pointer border'>
        Prev
      </button>
      {renderPagination()}
      <button className='mx-2 px-3 py-2 bg-white text-gray-500 hover:bg-gray-200 rounded shadow-sm  cursor-pointer border'>
        Next
      </button>
    </div>
  )
}
