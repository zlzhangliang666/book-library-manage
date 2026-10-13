-- =============================================================
-- 图书借阅系统（后台）数据库脚本
-- 包含：建库、建表、主键、主键自增、测试数据
-- 执行：mysql -uroot -p < sql/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS book_library
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE book_library;

DROP TABLE IF EXISTS book_info;
DROP TABLE IF EXISTS book_type;

-- -------------------------------------------------------------
-- 图书类型表
-- -------------------------------------------------------------
CREATE TABLE book_type (
  id       INT         NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  typeName VARCHAR(50) NOT NULL                COMMENT '图书类型名称',
  PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT = '图书类型表';

-- -------------------------------------------------------------
-- 图书信息表
-- -------------------------------------------------------------
CREATE TABLE book_info (
  bookId         INT          NOT NULL AUTO_INCREMENT COMMENT '图书ID',
  bookCde        VARCHAR(50)  NOT NULL                COMMENT '图书编号',
  bookName       VARCHAR(100) NOT NULL                COMMENT '图书名称',
  bookType       INT          NOT NULL                COMMENT '图书类型（关联 book_type.id）',
  bookAuthor     VARCHAR(100) NOT NULL                COMMENT '图书作者',
  publishPress   VARCHAR(100) NOT NULL                COMMENT '出版社',
  publishDate    DATE         NOT NULL                COMMENT '出版日期',
  borrowed       INT          NOT NULL DEFAULT 0      COMMENT '是否借阅（1 已借阅 0 未借阅）',
  createdBy      VARCHAR(50)  NOT NULL                COMMENT '入库人',
  creationTime   DATE         NOT NULL                COMMENT '入库时间',
  lastUpdatetime DATETIME     NULL                    COMMENT '最新更新时间',
  PRIMARY KEY (bookId),
  KEY idx_book_name (bookName),
  CONSTRAINT fk_book_info_type FOREIGN KEY (bookType) REFERENCES book_type (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT = '图书信息表';

-- -------------------------------------------------------------
-- 测试数据：图书类型（8 条）
-- -------------------------------------------------------------
INSERT INTO book_type (typeName) VALUES
  ('小说'), ('文学'), ('传记'), ('艺术'), ('少儿'), ('经济'), ('管理'), ('科技');

-- -------------------------------------------------------------
-- 测试数据：图书信息（12 条）
-- -------------------------------------------------------------
INSERT INTO book_info
  (bookCde, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime)
VALUES
  ('BK000023', '企业应用架构模式',   8, '（英）Martin Fowler',  '机械工业出版社',     '2013-05-01', 0, '系统管理员', '2014-07-03'),
  ('BK000024', '精通Hibernate',     8, '刘洋',                 '电子工业出版社',     '2013-04-02', 1, '系统管理员', '2014-05-03'),
  ('BK000025', '天龙八部',           1, '金庸',                 '中原出版社',         '2012-01-01', 0, '系统管理员', '2014-03-12'),
  ('BK000026', '寻找家园',           4, '高尔泰',               '北京十月文艺出版社', '2013-02-02', 0, '系统管理员', '2014-03-01'),
  ('BK000027', '小猫莫格成长系列',   5, '（英）朱迪斯·克尔',    '接力出版社',         '2013-03-03', 1, '系统管理员', '2014-01-01'),
  ('BK000028', '活着',               2, '余华',                 '作家出版社',         '2012-12-20', 0, '系统管理员', '2013-12-20'),
  ('BK000029', '国富论',             6, '（英）亚当·斯密',      '商务印书馆',         '2012-11-11', 1, '系统管理员', '2013-11-11'),
  ('BK000030', '卓有成效的管理者',   7, '彼得·德鲁克',          '机械工业出版社',     '2012-10-08', 0, '系统管理员', '2013-10-08'),
  ('BK000031', '乔布斯传',           3, '（美）沃尔特·艾萨克森','中信出版社',         '2012-09-15', 1, '系统管理员', '2013-09-15'),
  ('BK000032', '三体',               1, '刘慈欣',               '重庆出版社',         '2012-08-08', 0, '系统管理员', '2013-08-08'),
  ('BK000033', '代码大全',           8, '史蒂夫·迈克康奈尔',    '电子工业出版社',     '2012-07-07', 1, '系统管理员', '2013-07-07'),
  ('BK000034', '窗边的小豆豆',       5, '（日）黑柳彻子',       '南海出版公司',       '2012-06-06', 0, '系统管理员', '2013-06-06');
