---
title: Multivariate Data Analysis
description: From a matrix of observations to covariance, geometry, and dimension reduction.
tags:
  - statistics
---

> [!note] Starter example
> A brief overview connecting multivariate statistics with linear algebra.

## Data as a matrix

Suppose $n\geq 2$ observations are measured on $p$ variables. Let $X\in\mathbb{R}^{n\times p}$ contain the data after subtracting each column's sample mean, so that

$$
\mathbf{1}_n^\top X=0.
$$

The sample covariance matrix is

$$
S=\frac{1}{n-1}X^\top X.
$$

Its diagonal entries describe the sample variance of each variable. Its off-diagonal entries describe pairwise sample covariance.

## Why linear algebra appears

[[Linear Algebra]] provides the tools to study $S$. [[Principal Component Analysis]] uses its eigenvectors to summarize variation in a smaller number of directions, and [[Singular Value Decomposition]] obtains the same directions directly from $X$.

## Centering and scaling

Centering removes column means. Standardizing also divides each centered column by its sample standard deviation, when that deviation is positive. PCA of standardized data corresponds to a correlation-matrix analysis and can differ substantially from PCA of the original centered data.

## A question to develop

Which relationships change when the measurement units of one variable change?
