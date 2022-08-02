import React, {useEffect, useState} from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
    };
    
    const updateNews = async () => {
        props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${props.page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        console.log(parsedData)

        setArticles(parsedData.articles);
        setLoading(false);
        setPage(1);
        setTotalResults(parsedData.totalResults);

        props.setProgress(100);
    }
 
    useEffect(() => {
        document.title = `Utpal News- ${props.category}`
        updateNews(); 
        // eslint-disable-next-line
    }, [])

    // const handlePrevClick = async () => {
    //     console.log("Previous");
    //     setPage(page-1)
    //     updateNews();
    // }
    // const handleNextClick = async () => {
    //     console.log("Next");
    //      setPage(page+1)
    //     updateNews();
    // }
        return (
            <>
                <h2 className="text-center" style={{marginTop: '80px'}}>Utpal News: This is {props.category} News</h2>
                {loading && <Spinner />}

                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />}
                >
                    <div className="container my-2">
                        <div className="row">
                            {articles.map((element) => {
                                return <div className="col-md-3" key={element.url}>
                                    <NewsItems title={element.title} description={element.description} imageURL={element.urlToImage} url={element.url} date={element.publishedAt} author={element.author} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
                {/* <div className="conatiner d-flex justify-content-between my-3">
                        <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
                        <button disabled={state.page + 1 > Math.ceil(state.totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
                    </div> */}
            </>
        )
}
News.callerdafaultProps = {
    country: 'us',
    pageSize: 6,
    category: 'general'
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News