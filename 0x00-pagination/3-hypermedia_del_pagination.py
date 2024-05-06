#!/usr/bin/env python3
"""function named index_range"""
import csv
import math
from typing import List, Dict


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
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            self.__indexed_dataset = {i: row for i, row in enumerate(dataset)}
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Provides hypermedia information about
        a requested page of data with deletion resilience.

        Args:
            index: The starting index of the requested page (default: None).
            page_size: The number of entries per page (default: 10).

        Returns:
            A dictionary containing hypermedia
            information about the requested page.
        """

        assert index is None or 0 <= index < len(self.indexed_dataset),

        if index is None:
            index = 0

        dataset = self.indexed_dataset()
        data = []
        next_index = index

        for i in range(index, index + page_size):
            if i in dataset:
                data.append(dataset[i])
                next_index = i + 1

        return {
            "index": index,
            "data": data,
            "page_size": page_size,
            "next_index": next_index if next_index < len(dataset) else None
        }
