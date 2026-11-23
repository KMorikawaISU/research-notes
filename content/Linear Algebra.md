---
title: Linear Algebra
description: Vector spaces, projections, and matrix decompositions as tools for statistical thinking.
tags:
  - mathematics
---

> [!note] Starter example
> An introductory topic page showing how related concepts can be connected.

## The main idea

Linear algebra provides a language for vectors, linear transformations, and geometry. In statistics, a data matrix places observations in rows and variables in columns, making projections and matrix decompositions useful tools for understanding the data.

For a real symmetric matrix $S\in\mathbb{R}^{p\times p}$, the spectral decomposition is

$$
S=V\Lambda V^\top,
\qquad V^\top V=I_p.
$$

The columns of $V$ are orthonormal eigenvectors. If $S$ is a covariance matrix, its eigenvalues are nonnegative.

## Connections

- [[Multivariate Data Analysis]] uses vectors and covariance matrices to study relationships among variables.
- [[Principal Component Analysis]] uses covariance eigenvectors to choose directions of greatest sample variance.
- [[Singular Value Decomposition]] extends matrix decomposition to rectangular matrices and gives a direct computational route to PCA.

## A question to develop

How does an orthogonal projection separate a data vector into a fitted part and a residual part?
