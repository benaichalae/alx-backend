#!/usr/bin/env python3
"""function named index_range"""
import csv
import math
from typing import Tuple, List


def index_range(page: int, page_size: int) -> tuple:
    """
    This function calculates the start and
    end index for a given page and page size.

    Args:
        page: The page number (1-indexed).
        page_size: The number of elements per page.

    Returns:
        A tuple containing the start and end index for the requested page.
    """

    if page <= 0:
        raise ValueError("Page number must be positive")
    if page_size <= 0:
        raise ValueError("Page size must be positive")

    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieves a page of data from the baby names dataset.

        Args:
            page: The page number (default: 1).
            page_size: The number of entries per page (default: 10).

        Returns:
            A list containing the requested page of data, or an empty list if
            the requested page is out of range.
        """

        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0

        total_records = len(self.dataset())
        total_pages = math.ceil(total_records / page_size)

        if page > total_pages:
            return []  # Empty list for out-of-range pages

        start_index, end_index = index_range(page, page_size)
        return self.dataset()[start_index:end_index]
