---
title: Principal Component Analysis
aliases:
  - PCA
description: Principal directions of sample variation and their relationship to the SVD.
tags:
  - statistics
  - mathematics
---

> [!note] Starter example
> A short derivation connecting PCA, covariance matrices, and the SVD.

## Choose directions of greatest variance

Let $X\in\mathbb{R}^{n\times p}$ be column-centered data, with $n\geq 2$ and rank $r\geq 1$. Write $S=X^\top X/(n-1)$.

The first principal direction solves

$$
v_1\in\underset{\|v\|_2=1}{\operatorname{arg\,max}}\;v^\top Sv.
$$

Subsequent directions maximize the same quantity subject to being orthogonal to the preceding directions. They can be chosen as orthonormal eigenvectors of $S$, ordered by decreasing eigenvalue. Here, a **loading vector** means one of these unit eigenvectors.

## Read PCA from the SVD

The compact [[Singular Value Decomposition]] gives

$$
X=U_rD_rV_r^\top,
\qquad
S=V_r\frac{D_r^2}{n-1}V_r^\top.
$$

For $j=1,\ldots,r$, the $j$th score vector and its sample variance are

$$
t_j=Xv_j=d_ju_j,
\qquad
\operatorname{var}_{\mathrm{sample}}(t_j)=\frac{d_j^2}{n-1}.
$$

The proportion of total sample variance explained by this component is

$$
\frac{d_j^2}{\sum_{\ell=1}^{r}d_\ell^2}.
$$

## Interpretation

Centering and scaling matter; see [[Multivariate Data Analysis]]. Component signs are arbitrary, and tied eigenvalues can make individual directions nonunique. Large sample variance does not by itself imply predictive or scientific importance.

The underlying geometry comes from [[Linear Algebra]].
