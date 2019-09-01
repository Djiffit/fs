import { dummy, totalLikes, favoriteBlog, topBlogger, mostLikes } from '../src/utils/list_helper'
import { BlogType } from '../src/types'

const listWithOneBlog: BlogType[] = [
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
]

export const manyBlogs: BlogType[] = [
    {
      id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    },
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    },
    {
      id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    },
    {
      id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    },
    {
      id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    },
  ]


test('dummy returns one', () => {
    const blogs: BlogType[] = []

    const result = dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('with only one blog the likes are correct', () => {
        const likes = totalLikes(listWithOneBlog)

        expect(likes).toBe(5)
    })

    test('with no blogs the likes are zero', () => {
        expect(totalLikes([])).toBe(0)
    })

    test('with a list the total is the correct total', () => {
        expect(totalLikes(manyBlogs)).toBe(36)
    })

})


describe('favorite blog', () => {

    test('with only one blog returns correct', () => {
        const likes = favoriteBlog(listWithOneBlog)

        expect(likes).toEqual({title: listWithOneBlog[0].title, author: listWithOneBlog[0].author, likes: listWithOneBlog[0].likes})
    })

    test('returns undefined with no blogs', () => {
        expect(favoriteBlog([])).toBe(undefined)
    })

    test('with a list the blog is correct', () => {
        const favBlog = manyBlogs[2]
        const expObject = {
            title: favBlog.title,
            author: favBlog.author,
            likes: favBlog.likes,
        }
        expect(favoriteBlog(manyBlogs)).toEqual(expObject)
    })

})

describe('favorite blogger', () => {

    test('with only one blog returns correct', () => {
        const likes = topBlogger(listWithOneBlog)

        expect(likes).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1,
        })
    })

    test('returns undefined with no blogs', () => {
        expect(topBlogger([])).toBe(undefined)
    })

    test('with a list the blogger is correct', () => {
        const expObject = {
            author: 'Robert C. Martin',
            blogs: 3,
        }
        expect(topBlogger(manyBlogs)).toEqual(expObject)
    })

})


describe('total likes blogger', () => {

    test('with only one blog returns correct', () => {
        const likes = mostLikes(listWithOneBlog)

        expect(likes).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5,
        })
    })

    test('returns undefined with no blogs', () => {
        expect(mostLikes([])).toBe(undefined)
    })

    test('with a list the blogger is correct', () => {
        const expObject = {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        }
        expect(mostLikes(manyBlogs)).toEqual(expObject)
    })

})
