import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import "bootstrap/dist/css/bootstrap.min.css";

class Pagination extends Component {
    constructor(props) {
        super(props);
        const { totalRecords = 0, pageLimit = 30, pageNeighbours = 0 } = this.props;

        this.pageLimit = typeof pageLimit  ===  'number' ? pageLimit : 30;
        this.totalRecords = typeof totalRecords  ===  'number' ? totalRecords : 0;

        // pageNeighbours can be: 0, 1 or 2
        this.pageNeighbours = typeof pageNeighbours  ===  'number'
            ? Math.max(0, Math.min(pageNeighbours, 2))
            : 0;

        this.totalPages = Math.ceil(this.props.totalRecords / this.props.pageLimit);

        this.state = { currentPage: 1 };

    }

    gotoPage = page => {
        const { onPageChanged = f => f } = this.props;
        const currentPage = Math.max(0, Math.min(page, this.totalPages));
        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            pageLimit: this.pageLimit,
            totalRecords: this.props.totalRecords
        };

        this.setState({ currentPage }, () => onPageChanged(paginationData));
    }

    handleClick = (page) => (evt) => {
        evt.preventDefault();
        this.gotoPage(page);
    }

    handlePrevent = (page) => (evt) => {
        evt.preventDefault();
    }

    handleMoveLeft = (evt) => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage - (this.pageNeighbours * 2) - 1);
    }

    handleMoveRight = (evt) => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage + (this.pageNeighbours * 2) + 1);
    }


    fetchPageNumbers = () => {
        const LEFT_PAGE = 'LEFT';
        const RIGHT_PAGE = 'RIGHT';
        const range = (from, to, step = 1) => {
            let i = from;
            const range = [];

            while (i <= to) {
                range.push(i);
                i += step;
            }

            return range;
        }
        const totalPages = this.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbours = this.pageNeighbours;

        /**
         * totalNumbers: the total page numbers to show on the control
         * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
         */
        const totalNumbers = (this.pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                // handle: (1) {2 3} [4] {5 6} > (10)
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                // handle: (1) < {4 5} [6] {7 8} > (10)
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    }

    _disabled(e){
        return false;
    }
    render() {
        if (!this.props.totalRecords || this.totalPages  ===  1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();
        const LEFT_PAGE = 'LEFT';
        const RIGHT_PAGE = 'RIGHT';
        return (
            <Fragment>
                <nav aria-label="Countries Pagination">
                    <ul className="pagination">
                        {pages.map((page, index) => {

                            if (page  ===  LEFT_PAGE) return (
                                <li key={index} className="page-item">
                                    <a className="page-link" style={{ backgroundColor: "#000" }} href="#" aria-label="Previous" onClick={this.handleMoveLeft}>
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                </li>
                            );

                            if (page  ===  RIGHT_PAGE) return (
                                <li key={index} className="page-item">
                                    <a className="page-link" style={{ backgroundColor: "#000" }} href="#" aria-label="Next" onClick={this.handleMoveRight}>
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </li>
                            );

                            return (
                                <li key={index} className={`page-item${currentPage  ===  page ? ' active' : ''}`}>
                                    <a className="page-link" style={{ backgroundColor: "#000" }} href="#" onClick={currentPage  ===  page ? this.handlePrevent(page) : this.handleClick(page)}>{page}</a>
                                </li>
                            );

                        })}

                    </ul>
                </nav>
               
            </Fragment>
        );
    }
}

Pagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageLimit: PropTypes.number,
    pageNeighbours: PropTypes.number,
    onPageChanged: PropTypes.func
};

export default Pagination;