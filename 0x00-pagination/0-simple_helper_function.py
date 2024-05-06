#!/usr/bin/env python3
"""function named index_range"""
from typing import Tuple


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
