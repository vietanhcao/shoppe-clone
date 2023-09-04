interface ProductRatingProps {
  rating: number
}

export default function ProductRating({ rating }: ProductRatingProps) {
  return (
    <div className='flex items-center'>
      {Array.from({ length: 5 }).map((_, index) => {
        const order = index + 1 // 1,2,3,4,5
        let percentStartFill = 0

        if (order < rating) {
          percentStartFill = 100
        } else {
          // check if rating is float number and order is equal to ceil of rating
          if (rating % 1 !== 0 && order === Math.ceil(rating)) {
            percentStartFill = (rating % 1) * 100
          } else {
            percentStartFill = 0
          }
        }

        return (
          <div className='relative' key={index}>
            <div className={`absolute top-0 left-0 h-full overflow-hidden w-[${percentStartFill}%]`}>
              <svg
                enableBackground='new 0 0 15 15'
                viewBox='0 0 15 15'
                x={0}
                y={0}
                className='w-3 h-3 fill-yellow-300 text-yellow-300'
              >
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
            <svg
              enableBackground='new 0 0 15 15'
              viewBox='0 0 15 15'
              x={0}
              y={0}
              className='w-3 h-3 fill-current text-gray-300'
            >
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </svg>
          </div>
        )
      })}
    </div>
  )
}
